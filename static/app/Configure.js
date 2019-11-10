const SubmitButton = ({ name }) => (
    <button className="btn waves-effect waves-light" type="submit" name="action">
        <i className="material-icons right">send</i>{name}
    </button>
)

const Loader = () => (
    <div className="progress">
        <div className="indeterminate"></div>
    </div>
)

class Slider extends React.Component {
    state = { value: 0 }
    componentDidMount = () => { this.setState({ value: this.props.value || 50 }) }
    handleChange = e => { this.setState({ value: e.target.value }) }
    render() {
        const { title, name, min, max, step } = this.props;
        const { value } = this.state;
        return (
            <div className="row">
                <div className="col s11 m11">
                    <p className="range-field">
                        <h6 htmlFor="std" class="black-text">
                            {title}
                            <input onChange={this.handleChange} value={value} type="range" name={name} min={min || 0} max={max || 100} step={step || 5} />
                        </h6>
                    </p>
                </div>
                <div className="col s1 m1">
                    <h5 id="std-value">{value}{name==="test_set_percentage"&&"%"}</h5>
                </div>
            </div>
        )
    }
}

class FeatureSelector extends React.Component {
    render() {
        const { optionList } = this.props
        const options = optionList.map(item => <option key={item} value={item}>{item}</option>)
        return (
            <div className="row">
            <div className="col s12 m12">
                <h6>Target Feature (Output)</h6>
                <select name="target_column" className="browser-default" required>
                    <option value="">Choose your option</option>
                    { options }
                </select>
            </div>
            </div>
        )
    }
}


class Main extends React.Component {
    state = {
        isLoading: false,
        hasData: false,
        columns: null
    }
    componentDidMount = () => {
        console.log("fetcing..")
        this.setState({ isLoading: true })
        fetch("/get/data")
            .then(data => data.json())
            .then(data_json => {
                this.setState({
                    isLoading: false,
                    hasData: true,
                    columns: data_json.columns,
                    shape: data_json.shape,
                    dataAsTableHTML: data_json.data_table
                })
            })
    }

    render() {
        return (
            <div>
                <h4>Configure Model Parameters</h4>
                {this.state.isLoading && <h1><Loader /></h1>}
                <form action="/train_model" method="POST">
                {this.state.hasData &&
                    <FeatureSelector optionList={this.state.columns} />
                }
                <Slider title="Smoothing Factor (σ)" name="sigma" value="0.5" min="0" max="1" step=".01" />
                <Slider title="Std Deviation (std)" name="std" value="0.5" min="0" max="1" step=".01" />
                <Slider title="Test Set Ratio (%)" name="test_set_percentage" value="33" min="0" max="100" step="1" />
                <a href="/dataview" className="btn grey darken-2">Back to Data View</a>
                <button type="submit" className="btn right">Continue</button>
                </form>
            </div>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById("root"))