import React from 'react';
import './index.scss';

export default class TweetItem extends React.Component {
    getFullUrl(id) {
        var protocol = location.protocol;
        var host = location.host;
        var url = protocol + '//' + host + '/post/' + id;
        return url;
    }
    componentDidMount() {
        const {data} = this.props;
        data.gotoUrl = this.getFullUrl(data.id);
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
        const {data = {}, isActive} = this.props;
        const {title, text} = data;
        const cls = isActive ? `tweet active` : `tweet` ;
        return (
            <li className={cls} onClick={this.onSelected} onMouseOver={this.onMouseOver}>
                <p className="title ellipsis">{title}</p>
                <p className="content ellipsis">{text}</p>
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

