import React from 'react';
import {Keys} from "../util/Keys";

class SubmittableInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue,
        };

        this.id = 'submittable-input-' + (Math.random()*1000000).toFixed(0);
        this.input = this.useFocus();
    }

    render() {
        return (
            <li>
                <input id={this.id}
                       className='submittable-input'
                       placeholder={this.props.placeholder}
                       value={this.state.value}
                       autoFocus={this.props.autofocus}
                       ref={this.input.ref}
                       onClick={(evt) => this.props.onClick && this.props.onClick(evt)}
                       onChange={evt => this.setState({value: evt.target.value})}>
                </input>

                <div>
                    {this.state.value && !this.state.submitting && (
                        <span className="clickable"
                              onClick={() => this.submit(this.state.value)}>
                                    Submit
                        </span>
                    )}

                    {(this.state.value && this.state.submitting &&
                        <span>...</span>
                    )}
                </div>
            </li>
        )
    }

    componentDidMount() {
        document.getElementById(this.id).addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        document.getElementById(this.id).removeEventListener('keydown', this.onKeyDown);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate.focusInput', this.props.focus);
        this.input.setFocus(this.props.focus);
    }

    onKeyDown = async (event) => {
       if (document.activeElement.localName === 'input') {
           if (event.key === Keys.enter) {
               this.submit(this.state.value);
           } else if (event.key === Keys.escape) {
               this.setState({value: ''})
           }
       }
    };

    useFocus = () => {
        const ref = React.createRef();
        const setFocus = (isFocused) => {
            if (!ref.current) return;
            if (isFocused) {
                ref.current.focus();
            } else {
                ref.current.blur();
            }
        };

        return {setFocus, ref}
    };

    submit = async (value) => {
        this.setState({submitting: true});
        this.props.submit(value).then(() => this.setState({value: '', submitting: false}));
    }
}

export default SubmittableInput;
