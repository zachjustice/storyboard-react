import React, {Component} from 'react';
import './App.css';
import NewChoice from './components/NewChoice';
import Choice from "./components/Choice";
import {connect} from "react-redux";

const mapStateToProps = (state) => ({...state});

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choices: props.choices
        }
    }

    render() {
        if (!this.props || !this.props.choices || !this.props.choices.length) return 'Fetching...';
        if (this.state.error) return 'Error!';

        return (
            <div className="App margin-left-1 margin-top-1">
                <div className='storyboard'>
                    {this.props.choices.map((choice, index) => {
                        return (
                            <Choice key={'choice-' + choice.id}
                                    isCurrentChoice={index === (this.props.choices.length - 1) && !this.props.createChoice}
                                    choice={choice}
                                    choiceIndex={index}/>
                        )
                    })}
                </div>
                {this.props.createChoice && !this.props.fetchingChoice && (
                    <NewChoice choiceIndex={this.props.choices.length}
                               parentOptionId={this.props.createChoice.parentOptionId}/>
                )}
                {this.props.fetchingChoice && '...'}
            </div>
        );
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }
}

const App = connect(mapStateToProps)(ConnectedApp);

export default App;
