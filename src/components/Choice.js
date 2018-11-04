import React from 'react';
import {Option} from "./Option";

export class Choice extends React.Component {
    onClick(option) {
        this.setState({ selectedOption: option});
        this.props.onClick(option.next);
    }

    isSelectedOption(option) {
        return this.state
            && this.state.selectedOption
            && this.state.selectedOption.id === option.id;
    }

    renderOptions(options) {
        return (options || []).map(option => (
            <Option value={option}
                    isSelected={this.isSelectedOption(option)}
                    key={'option' + option.id}
                    onClick={() => this.onClick(option)} />
        ));
    }

    render() {
        const choice = this.props.choice || {};
        const content = choice.content;

        return (
            <div className='choice'>
                <p>{content}</p>
                <ul>
                    {this.renderOptions(choice.options)}
                </ul>
            </div>
        );
    }
}
