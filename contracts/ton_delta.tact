import "@stdlib/deploy";

message(0x7362d09c) JettonTransferNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forward_payload: Slice as remaining;
}

message(0xf8a7ea5) TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message Withdraw {
    token: Address?; // null for TON
    amount: Int as coins;
}

message Trade {
    tokenGet: Address?;
    amountGet: Int as coins;
    tokenGive: Address?;
    amountGive: Int as coins;
    expires: Int as uint32;
    nonce: Int as uint64;
    maker: Address;
    amount: Int as coins; // Amount to fill (in terms of tokenGet)
    signature: Slice;
}

message Order {
    tokenGet: Address?;
    amountGet: Int as coins;
    tokenGive: Address?;
    amountGive: Int as coins;
    expires: Int as uint32;
    nonce: Int as uint64;
    maker: Address;
}

contract TonDelta with Deployable {
    owner: Address;
    // Key: sha256(user_address + token_address)
    balances: map<Address, Int>;
    // Key: sha256(order_hash) 
    orderFills: map<Address, Int>;
    orders: map<Address, Bool>;

    init() {
        self.owner = sender();
    }


    // --- Helpers ---
    
    // Calculate key for balances map
    fun getBalanceKey(user: Address, token: Address?): Address {
        let builder: Builder = beginCell();
        builder = builder.storeAddress(user);
        if (token != null) {
            builder = builder.storeAddress(token!!);
        } else {
             builder = builder.storeUint(0, 8); 
        }
        let hash: Int = builder.endCell().hash(); // Use representation hash
        return newAddress(0, hash);
    }

    fun getOrderHash(tokenGet: Address?, amountGet: Int, tokenGive: Address?, amountGive: Int, expires: Int, nonce: Int, maker: Address): Address {
        let b: Builder = beginCell();
        if (tokenGet != null) { b = b.storeAddress(tokenGet!!); } else { b = b.storeUint(0, 2); }
        b = b.storeCoins(amountGet);
        if (tokenGive != null) { b = b.storeAddress(tokenGive!!); } else { b = b.storeUint(0, 2); }
        b = b.storeCoins(amountGive);
        b = b.storeUint(expires, 32);
        b = b.storeUint(nonce, 64);
        b = b.storeAddress(maker);
        let hash: Int = b.endCell().hash(); // Use representation hash
        return newAddress(0, hash);
    }

    // --- Deposits ---

    // Deposit TON
    receive() {
        let ctx: Context = context();
        let key: Address = self.getBalanceKey(ctx.sender, null);
        let current: Int = 0;
        if (self.balances.get(key) != null) {
            current = self.balances.get(key)!!;
        }
        self.balances.set(key, current + ctx.value);
    }

    // Deposit Jettons
    receive(msg: JettonTransferNotification) {
        let ctx: Context = context();
        let user: Address = msg.sender;
        let token: Address = ctx.sender; // The contract address of the Jetton Wallet
        
        let key: Address = self.getBalanceKey(user, token);
        let current: Int = 0;
        if (self.balances.get(key) != null) {
            current = self.balances.get(key)!!;
        }
        self.balances.set(key, current + msg.amount);
    }

    // --- Withdrawals ---

    receive(msg: Withdraw) {
        let ctx: Context = context();
        let key: Address = self.getBalanceKey(ctx.sender, msg.token);
        let balance: Int = 0;
        if (self.balances.get(key) != null) {
            balance = self.balances.get(key)!!;
        }
        require(balance >= msg.amount, "Insufficient balance");
        self.balances.set(key, balance - msg.amount);

        if (msg.token == null) {
            // Withdraw TON
            send(SendParameters{
                to: ctx.sender,
                value: msg.amount, 
                mode: SendRemainingValue, 
                bounce: true,
                body: "Withdrawal".asComment()
            });
        } else {
            // Withdraw Jetton
            send(SendParameters{
                to: msg.token!!,
                value: 0,
                mode: SendRemainingValue,
                bounce: true,
                body: TokenTransfer{
                    query_id: 0,
                    amount: msg.amount,
                    destination: ctx.sender,
                    response_destination: ctx.sender,
                    custom_payload: null,
                    forward_ton_amount: 1, 
                    forward_payload: emptySlice()
                }.toCell()
            });
        }
    }

    // --- Trade ---
    
    receive(msg: Trade) {
        let ctx: Context = context(); // Taker
        // Hash order -> Address
        let orderKey: Address = self.getOrderHash(msg.tokenGet, msg.amountGet, msg.tokenGive, msg.amountGive, msg.expires, msg.nonce, msg.maker);
        
        // Check order exists
        require(self.orders.get(orderKey) == true, "Order not found");

        let amountGiveTrade: Int = (msg.amountGive * msg.amount) / msg.amountGet;
        
        // Check fills
        let filled: Int = 0;
        if (self.orderFills.get(orderKey) != null) {
            filled = self.orderFills.get(orderKey)!!;
        }
        require(filled + msg.amount <= msg.amountGet, "Order already filled");
        
        // Move funds
        // 1. Deduct Taker tokenGet
        let takerKeyGet: Address = self.getBalanceKey(ctx.sender, msg.tokenGet);
        let takerBalGet: Int = 0;
        if (self.balances.get(takerKeyGet) != null) { takerBalGet = self.balances.get(takerKeyGet)!!; }
        require(takerBalGet >= msg.amount, "Taker balance too low");
        self.balances.set(takerKeyGet, takerBalGet - msg.amount);
        
        // 2. Add Maker tokenGet
        let makerKeyGet: Address = self.getBalanceKey(msg.maker, msg.tokenGet);
        let makerBalGet: Int = 0;
        if (self.balances.get(makerKeyGet) != null) { makerBalGet = self.balances.get(makerKeyGet)!!; }
        self.balances.set(makerKeyGet, makerBalGet + msg.amount);
        
        // 3. Deduct Maker tokenGive
        let makerKeyGive: Address = self.getBalanceKey(msg.maker, msg.tokenGive);
        let makerBalGive: Int = 0;
        if (self.balances.get(makerKeyGive) != null) { makerBalGive = self.balances.get(makerKeyGive)!!; }
        require(makerBalGive >= amountGiveTrade, "Maker balance too low");
        self.balances.set(makerKeyGive, makerBalGive - amountGiveTrade);
        
        // 4. Add Taker tokenGive
        let takerKeyGive: Address = self.getBalanceKey(ctx.sender, msg.tokenGive);
        let takerBalGive: Int = 0;
        if (self.balances.get(takerKeyGive) != null) { takerBalGive = self.balances.get(takerKeyGive)!!; }
        self.balances.set(takerKeyGive, takerBalGive + amountGiveTrade);
        
        // Update Order Logic
        self.orderFills.set(orderKey, filled + msg.amount);
    }
    
    receive(msg: Order) {
        let ctx: Context = context();
        require(ctx.sender == msg.maker, "Invalid maker");
        let hash: Address = self.getOrderHash(msg.tokenGet, msg.amountGet, msg.tokenGive, msg.amountGive, msg.expires, msg.nonce, msg.maker);
        self.orders.set(hash, true);
    }
    
    // Getters
    get fun balance(user: Address, token: Address?): Int {
        let key: Address = self.getBalanceKey(user, token);
        if (self.balances.get(key) == null) { return 0; }
        return self.balances.get(key)!!;
    }
    
    get fun orderFill(tokenGet: Address?, amountGet: Int, tokenGive: Address?, amountGive: Int, expires: Int, nonce: Int, maker: Address): Int {
        let hash: Address = self.getOrderHash(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, maker);
        if (self.orderFills.get(hash) == null) { return 0; }
        return self.orderFills.get(hash)!!;
    }
}
