import React from 'react';

//用户Item
export default class UserItem extends React.Component {
    getFullUrl(id) {
        //http:
        var protocol = location.protocol;
        var host = location.host;
        var url = protocol + '//' + host + '/personal/' + id;
        return url;
    }
    componentDidMount() {
        const {data} = this.props;
        data.gotoUrl = this.getFullUrl(data.id);
    }
    /**
     * 选中执行
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
        const {name, avatar} = data;
        const cls = isActive ? 'user active' : 'user';
        const imgStyle = {
            background: `url(${avatar}) no-repeat`,
            'backgroundSize': 'cover'
        }

        return (
            <li className={cls} onClick={this.onSelected} onMouseOver={this.onMouseOver}>
                <i className="thumbnail" style={imgStyle}></i>
                <a href="javascript:;">{name}</a>
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

