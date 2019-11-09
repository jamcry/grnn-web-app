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
        const { name, min, max, step } = this.props;
        const { value } = this.state;
        return (
            <div className="row">
                <div className="col s10 m5">
                    <p className="range-field">
                        <label htmlFor="std">
                            {name}
                            <input onChange={this.handleChange} value={value} type="range" name={name} min={min || 0} max={max || 100} step={step || 5} />
                        </label>
                    </p>
                </div>
                <div className="col s2 m5">
                    <h5 id="std-value">{value}</h5>
                </div>
            </div>
        )
    }
}

class FeatureSelector extends React.Component {
    render() {
        const { optionList } = this.props
        return (
            <div className="col s12">
                <h6>Target Feature (Output)</h6>
                <select className="browser-default">
                    <option value="">Choose your option</option>
                    {
                        optionList.map(item => <option key={item} value={item}>{item}</option>)
                    }
                </select>
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
                {this.state.hasData &&
                    <FeatureSelector optionList={this.state.columns} />
                }
                <Slider name="Sigma" value=".5" min="0" max="1" step=".01" />
                <Slider name="Std" value=".5" min="0" max="1" step=".01" />
                <Slider name="Test%" value="33" min="0" max="100" step="1" />
                <a href="/dataview" className="btn grey darken-2">Back to Data View</a>
                <a href="/" className="btn disabled right">Continue</a>
            </div>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById("root"))