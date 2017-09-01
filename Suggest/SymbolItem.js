import React from 'react';
import './index.scss';

export default class SymbolItem extends React.Component {
    getFullUrl(symbol) {
        var protocol = location.protocol;
        var host = location.host;
        var url = protocol + '//' + host + '/hq/s/' + symbol;
        return url;
    }
    componentDidMount() {
        const {data} = this.props;
        data.gotoUrl = this.getFullUrl(data.symbol);
    }
    /**
     * 去搜索落地页面
     */
    onSelected = (e) => {
        e.preventDefault();
        const {data, gotoSearch} = this.props;
        gotoSearch(data.gotoUrl);
    }
    onMouseOver = (e) => {
        const {setActiveItem, index, data} = this.props;
        //设置index 和 gotoUrl地址
        setActiveItem({selectedIndex: index, gotoUrl: data.gotoUrl});
    }
    render() {
        const {data, isActive} = this.props;
        const {symbol, market = '', nameCN} = data;
        const href = this.getFullUrl(symbol);
        const cls = isActive ? `symbol active` : `symbol` ;
        return (
            <li className={cls} onClick={this.onSelected} onMouseOver={this.onMouseOver}>
                <a href={href}>
                    <i className={'icon icon-' + market.toLowerCase()}></i>
                    {nameCN}
                    <span>{symbol}</span>
                </a>
            </li>
        )
    }
    static propTypes = {
        //数据obj
        data: React.PropTypes.object,
        //选中的对象
        isActive: React.PropTypes.bool,
        setActiveItem: React.PropTypes.func,
        gotoSearch: React.PropTypes.func
    }
}

