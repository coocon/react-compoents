import React from 'react';

//没有数据
export default class NoItem extends React.Component {
    render() {
        const {errorMsg = '暂无您要搜索的内容', onClick} = this.props;

        return (
            <div className="noContent" onClick={onClick}>
                <p>{errorMsg}</p>
            </div>
        )
    }
    static propTypes = {
        //数据obj
        errorMsg: React.PropTypes.string
    }
}

