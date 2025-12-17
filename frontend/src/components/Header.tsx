import { TonConnectButton } from '@tonconnect/ui-react';
import { Layers } from 'lucide-react';
import './Header.scss';

export function Header() {
    return (
        <header className="app-header">
            <div className="logo">
                <Layers className="icon" />
                <span>TonDelta</span>
            </div>
            <div className="actions">
                <TonConnectButton />
            </div>
        </header>
    );
}
