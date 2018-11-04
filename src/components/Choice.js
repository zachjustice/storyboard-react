import React from 'react';

export class Choice extends React.Component {
    render() {
        const choice = this.props.value || {};
        const content = choice.content;
        const options = (choice.options || []).map(option => (
            <li onClick={() => this.props.onClick(option)}
                key={'option' + option.id}>
                {option.description}
            </li>
        ));

        return (
            <div className='choice'>
                <p>{content}</p>
                <ul>
                    {options}
                </ul>
            </div>
        );
    }
}
