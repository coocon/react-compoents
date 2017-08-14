import React from 'react';
import {getSuggest} from 'utils/request';
import {render} from 'react-dom';
import Item from './Item';

import './index.scss';

const TIME_QUERY_DEDLAY = 200;
const TIME_HIDE_DEDLAY = 200;

class Suggest extends React.Component {
    state = {
        loading: false,
        data: [],
        value: '',
        show: false,
        isCommandDown: false,
        lastQuery: null,
        selectedSymbol: ''
    }
    getFullSymbolUrl = (symbol) => {
        //http:
        var protocol = location.protocol;
        var host = location.host;
        var url = protocol + '//' + host + '/hq/s/' + symbol;
        return url;
    }
    /**
     * 去搜索落地页面
     */
    gotoSearch = (symbol) => {
        const {isCommandDown, selectedSymbol} = this.state;
        symbol = symbol || selectedSymbol;
        if (!symbol) {
            return;
        }
        const href = this.getFullSymbolUrl(symbol);
        window.open(href);
        if (isCommandDown) {
            this.refs.eleInput.focus();
        }
    }
    hideResult = () => {
        this.timerHide = setTimeout(x => {
            this.setState({show: false})
        }, TIME_HIDE_DEDLAY);
    }
    onKeyUp = (e) => {
        if (e.keyCode == 227 || e.keyCode == 91) {
            this.setState({isCommandDown: false});
        }
    }
    onKeyDown = (e) => {
        switch(e.keyCode) {
            case 38: // up
                e.preventDefault();
                this.moveSelection('up');
                break;
            case 40: // down
                e.preventDefault();
                this.moveSelection('down');
                break;
            case 27: // esc
                this.hideResult();
                break;
            case 9: case 188:  // tab or comm
                this.gotoSearch();
                this.hideResult();
                break;
            case 13: // return
                this.gotoSearch();
                this.hideResult();
                break;
                // ch
            case 224: case 91:
                this.setState({isCommandDown: true});
                break;
            default:
                break;
        }
    }
    onChange = (e) =>{
        const value = e.target.value;
        this.setState({value: value})
        //关键词为空
        if (value.length === 0) {
            this.setState({data: [], show: false, selectedSymbol: ''});
            return;
        }
        if (this.timerQuery) {
            clearTimeout(this.timerQuery);
        }
        this.timerQuery = setTimeout(x => {
            this.getData(value);
            this.timerQuery = null;
        }, TIME_QUERY_DEDLAY)
    }
    onFocus = (e) =>{
        const {data} = this.state;
        if (this.timerHide) {
            clearTimeout(this.timerHide);
            this.timerHide = null;
        }
        if (data.length > 0) {
            this.setState({show: true});
        }
    }

    onBlur = (e) =>{
        this.hideResult();
    }
    setActiveSymbol = (symbol) => {
        this.setState({selectedSymbol: symbol})
    }
    //获取数据
    getData = (word) => {
        this.setState({loading: true, lastQuery: word});
        getSuggest({
            params: {
                word: word
            }
        }).then(resp => {
            const data = resp.data && resp.data.items || [];
            const {lastQuery} = this.state;
            if (lastQuery == word) {
                this.setState({
                    data:  data,
                    selectedSymbol: data[0] && data[0].symbol,
                    show: !!data.length,
                    loading: false
                });
            }
        }).catch(x => {
            const {lastQuery} = this.state;
            if (lastQuery == word) {
                this.setState({
                    show: false,
                    selectedSymbol: '',
                    loading: false
                });
            }
        })
    }
    moveSelection = (direction) => {
        const {data, selectedSymbol} = this.state;
        let seletedIndex = 0;
        let len = data.length;
        if (len === 0) {
            return;
        }
        data.forEach((item, index) => {
            if (item.symbol == selectedSymbol) {
                seletedIndex = index;
            }
        })
        if (direction === 'up') {
            seletedIndex -= 1;
            if (seletedIndex < 0) {
                seletedIndex = len - 1;
            }
        }
        if (direction === 'down') {
            seletedIndex += 1;
            if (seletedIndex >= len) {
                seletedIndex = 0;
            }
        }
        this.setActiveSymbol(data[seletedIndex].symbol);
    }

    renderResult = () => {
        const {data, selectedSymbol} = this.state;

        return(
            data.map(item => {
                return (<Item key={item.symbol} {...item} selectedSymbol={selectedSymbol} setActiveSymbol={this.setActiveSymbol} gotoSearch={this.gotoSearch}/>)
            })
        )
    }
    handleSubmit(event) {
        event.preventDefault();
    }
    render() {
        const placeholder = '输入股票名称、代码、拼音';

        const {show, value} = this.state;
        const style = show ? {'display': 'block'} : {'display': 'none'}

        return (
            <div className="search">
                <form className="frm-search" action="#" method="get" onSubmit={this.handleSubmit}>
                    <i className="iconfont icon-sousuo"></i>
                    <input ref="eleInput" className="quick-search" value={value} onBlur={this.onBlur} onFocus={this.onFocus} onKeyDown={this.onKeyDown} onChange={this.onChange} placeholder={placeholder} autoComplete="off" type="text" />
                    <ul className="search-result" style={style}>
                        {this.renderResult()}
                    </ul>
                </form>
            </div>
        )
    }
}

if ($('#header .search-wrap')[0]) {
    //渲染锚点
    render(<Suggest />, $('#header .search-wrap')[0]);
}
