import React from 'react';
import {Option} from "./Option";

export class Choice extends React.Component {

    render() {
        const renderOptions = (options) => {
            return (options || []).map(option => (
                <Option value={option}
                        key={'option-' + option.id}
                        onClick={this.props.onClick} />
            ));
        };

        const choice = this.props.choice || {};
        const content = choice.content;

        return (
            <div className='choice'>
                <div className='flexContainer'>
                    <div>
                        <span className='bold'> > </span>
                    </div>
                    <div className='margin-left-1'>
                        {content}
                    </div>
                </div>
                <ol className='margin-left-1'>
                    {renderOptions(choice.options)}
                </ol>
            </div>
        );
    }
}

