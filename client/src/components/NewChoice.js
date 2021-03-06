import React from 'react';
import {connect} from "react-redux";
import {createdChoice, undoChoiceSelection} from "../actions/ActionCreators";
import {createChoice} from "../services/Choices.service";
import {Keys} from "../util/Keys";
import SubmittableInput from "./SubmittableInput";

const mapDispatchToProps = dispatch => ({
    createdChoice: (choiceIndex, parentOptionId, choice) => dispatch(createdChoice(choiceIndex, parentOptionId, choice)),
    undoChoiceSelection: (choiceIndex) => dispatch(undoChoiceSelection(choiceIndex)),
});

class NewChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className='choice'>
                <div className='flex-container choice-content-container'>
                    <div>
                        <span className='bold caret'> > </span>
                    </div>
                    <div>
                        <span className='bold dir margin-right-0_5'> ~ </span>
                    </div>
                    <SubmittableInput autofocus={true}
                                      focus={true}
                                      placeholder="What's next...?"
                                      submit={(choiceContent) => this.submit(this.props.choiceIndex, this.props.parentChoiceId, this.props.parentOptionId, choiceContent)}
                                      initialValue={''}/>
                </div>
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
        if (event.key === Keys.escape) {
            this.props.undoChoiceSelection(this.props.parentOptionId);
            this.removeListener();
        }
    };

    submit = async (choiceIndex, parentChoiceId, parentOptionId, choiceContent) => {
        this.setState({creatingChoice: true});
        const choice = await createChoice(parentChoiceId, parentOptionId, choiceContent);
        this.setState({creatingChoice: false});

        return this.props.createdChoice(choiceIndex, parentOptionId, choice);
    };
}

export default connect(null, mapDispatchToProps)(NewChoice);
