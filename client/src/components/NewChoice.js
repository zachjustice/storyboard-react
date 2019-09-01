import React from 'react';
import {connect} from "react-redux";
import {selectOption} from "../actions/ActionCreators";
import {createChoice} from "../services/Choices.service";

const mapDispatchToProps = dispatch => ({
    selectOption: (choiceIndex, choice) => dispatch(selectOption(choiceIndex, choice)),
});

class NewChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choiceContent: ''
        };
    }

    render() {
        return (
            <div className='choice'>
                <div className='flex-container'>
                    <div>
                        <span className='bold caret'> > </span>
                    </div>
                    <div>
                        <span className='bold dir margin-right-0_5'> ~ </span>
                    </div>
                    <input className='new-choice'
                           placeholder="What's next...?"
                           onChange={evt => this.onChange(evt)}>
                    </input>
                </div>

                {this.state.choiceContent && !this.state.creatingChoice && (
                    <ol>
                        <span className="clickable"
                              onClick={() => this.onClick(this.props.parentOptionId, this.state.choiceContent)}>
                            Submit
                        </span>
                    </ol>
                )}

                {this.state.creatingChoice && (
                    <ol>...</ol>
                )}
            </div>
        )
    }

    onClick = async (parentOptionId, choiceContent) => {
        this.setState({creatingChoice: true});
        const choice = await createChoice(parentOptionId, choiceContent);
        this.setState({creatingChoice: false});
        return this.props.selectOption(this.props.choiceIndex, choice);
    };

    onChange(evt) {
        this.setState({choiceContent: evt.target.value});
    }
}

export default connect(null, mapDispatchToProps)(NewChoice);
