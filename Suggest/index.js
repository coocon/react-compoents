import React from 'react';
import {getSuggestV2 as getSuggest} from 'utils/request';
import {render} from 'react-dom';
import SymbolItem from './SymbolItem';
import UserItem from './UserItem';
import TweetItem from './TweetItem';
import NoItem from './NoItem';

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
        //内容的tabIndex  股票 用户 帖子
        tabIndex: 0,
        selectedIndex: '',
        gotoUrl: '#'
    }
    /**
     * 去搜索落地页面
     * user symbol post
     */
    gotoSearch = (url) => {
        const {isCommandDown, gotoUrl} = this.state;
        url = url || gotoUrl;
        if (!url) {
            return;
        }
        window.open(url);
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
            this.setState({data: [], show: false, selectedIndex: 0});
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
        if (this.checkDataNotEmpty(data)) {
            this.setState({show: true});
        }
    }
    checkDataNotEmpty = (data) => {
        let res = false;
        if (!data) {
            return res;
        }
        ['stocks', 'tweets', 'users'].forEach(item => {
            if (data[item] && data[item].items && data[item].items.length > 0) {
                res = true;
            }
        })
        return res;

    }

    onBlur = (e) =>{
        this.hideResult();
    }
    //设置index 和取得位置
    //selectedIndex, gotoUrl
    setActiveItem = (obj) => {
        this.setState(obj)
    }

    //获取数据
    getData = (word) => {
        this.setState({loading: true, lastQuery: word});
        getSuggest({
            params: {
                word: word
            }
        }).then(resp => {
            const data = resp.data || {};
            const {lastQuery} = this.state;
            if (lastQuery == word) {
                this.setState({
                    data:  data,
                    selectedIndex: 0,
                    show: this.checkDataNotEmpty(data),
                    loading: false
                });
            }
        }).catch(x => {
            const {lastQuery} = this.state;
            if (lastQuery == word) {
                this.setState({
                    show: false,
                    selectedIndex: 0,
                    loading: false
                });
            }
        })
    }
    moveSelection = (direction) => {
        let {selectedIndex, tabIndex} = this.state;
        const dataList = this.getTabIndexData(tabIndex);
        let len = dataList.length;
        if (len === 0) {
            return;
        }
        if (direction === 'up') {
            selectedIndex -= 1;
            if (selectedIndex < 0) {
                selectedIndex = len - 1;
            }
        }
        if (direction === 'down') {
            selectedIndex += 1;
            if (selectedIndex >= len) {
                selectedIndex = 0;
            }
        }
        this.setActiveItem({
            selectedIndex: selectedIndex,
            gotoUrl: dataList[selectedIndex].gotoUrl
        });
    }

    getTabIndexData = (tabIndex) => {
        const {data} = this.state;
        const type = ['stocks', 'users', 'tweets'][tabIndex];
        return data[type] && data[type].items || data;
    }
    //需要跟之前一一对应
    getComponentItem = (tabIndex) => {
       return [SymbolItem, UserItem, TweetItem][tabIndex];
    }

    renderResult = () => {
        const {selectedIndex, tabIndex} = this.state;
        const dataList = this.getTabIndexData(tabIndex)
        const type = ['股票', '用户', '帖子'][tabIndex];

        if (dataList.length == 0) {
            return <NoItem errorMsg={"未找到相关" + type} onClick={() => { this.refs.eleInput.focus() }} />;
        }
        const Item = this.getComponentItem(tabIndex);
        return(
            <ul className="result-content">
                { dataList.map((item, index) => {
                    const isActive = selectedIndex == index;
                    return <Item key={'symbol' + index} data={item} index={index}
                                isActive={isActive}
                                setActiveItem={this.setActiveItem}
                                gotoSearch={this.gotoSearch}
                            />
                  })
                }
            </ul>
        )
    }
    handleSubmit(event) {
        event.preventDefault();
    }
    setTabIndex = (index) => {
        this.refs.eleInput.focus();
        this.setState({tabIndex: index})
    }
    getClsName = (tabIndex, index) => {
        return tabIndex == index ? 'tab-item active' : 'tab-item';
    }
    render() {
        const placeholder = '输入股票名称、代码、拼音';

        const {show, value, tabIndex} = this.state;
        const style = show ? {'display': 'block'} : {'display': 'none'}

        return (
            <div className="search">
                <form className="frm-search" action="#" method="get" onSubmit={this.handleSubmit}>
                    <i className="iconfont icon-sousuo"></i>
                    <input ref="eleInput" className="quick-search" value={value} onBlur={this.onBlur} onFocus={this.onFocus} onKeyDown={this.onKeyDown} onChange={this.onChange} placeholder={placeholder} autoComplete="off" type="text" />
                    <div className="search-result" style={style}>
                        <div className="result-head">
                            <p className={this.getClsName(tabIndex, 0)} onClick={(e) => {this.setTabIndex(0)}}>股票</p>
                            <p className={this.getClsName(tabIndex, 1)} onClick={(e) => {this.setTabIndex(1)}}>用户</p>
                            <p className={this.getClsName(tabIndex, 2)} onClick={(e) => {this.setTabIndex(2)}}>帖子</p>
                        </div>
                        {this.renderResult()}
                    </div>
                </form>
            </div>
        )
    }
}

if ($('#header .search-wrap')[0]) {
    //渲染锚点
    render(<Suggest />, $('#header .search-wrap')[0]);
}
