import React from 'react';
import './index.scss';

export default class Item extends React.Component {
    getFullSymbolUrl(symbol) {
        //http:
        var protocol = location.protocol;
        var host = location.host;
        var url = protocol + '//' + host + '/hq/s/' + symbol;
        return url;
    }
    /**
     * 去搜索落地页面
     */
    gotoSearch = (e) => {
        e.preventDefault();
        const {symbol, gotoSearch} = this.props;
        gotoSearch(symbol);
    }
    onMouseOver = (e) => {
        const {setActiveSymbol, symbol} = this.props;
        setActiveSymbol(symbol);
    }
    render() {
        const {symbol, nameCN, selectedSymbol} = this.props;
        const href = this.getFullSymbolUrl(symbol);
        const cls = symbol == selectedSymbol ? 'symbol active' : 'symbol';


        return (
            <li className={cls} onClick={this.gotoSearch} onMouseOver={this.onMouseOver}>
                <a href={href}>{nameCN}
                    <span>{symbol}</span>
                </a>
            </li>
        )
    }
}

