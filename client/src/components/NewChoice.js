import React from 'react';
import {connect} from "react-redux";
import {addChoice, undoChoiceSelection} from "../actions/ActionCreators";
import {createChoice} from "../services/Choices.service";
import {Keys} from "../util/Keys";

const mapDispatchToProps = dispatch => ({
    addChoice: (choiceIndex, choice) => dispatch(addChoice(choiceIndex, choice)),
    undoChoiceSelection: (choiceIndex) => dispatch(undoChoiceSelection(choiceIndex)),
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
                           autoFocus={true}
                           onChange={this.updateChoiceContent}>
                    </input>
                </div>

                {this.state.choiceContent && !this.state.creatingChoice && (
                    <ol>
                        <span className="clickable"
                              onClick={() => this.submit(this.props.choiceIndex, this.props.parentOptionId, this.state.choiceContent)}>
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

    componentDidMount() {
        this.addListener();
    }

    componentWillUnmount() {
        this.removeListener();
    }

    addListener() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    removeListener() {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = async (event) => {
        switch (event.key) {
            case Keys.escape:
                this.props.undoChoiceSelection(this.props.parentOptionId);
                this.removeListener();
                break;
            case Keys.enter:
                this.submit(this.props.choiceIndex, this.props.parentOptionId, this.state.choiceContent);
                break;
            default:
                return;
        }
    };

    submit = async (choiceIndex, parentOptionId, choiceContent) => {
        this.setState({creatingChoice: true});
        const choice = await createChoice(parentOptionId, choiceContent);
        this.setState({creatingChoice: false});

        return this.props.addChoice(choiceIndex, choice);
    };

    updateChoiceContent = (evt) => {
        this.setState({choiceContent: evt.target.value});
    }
}

export default connect(null, mapDispatchToProps)(NewChoice);
