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
    render() {
        const { title, value, onChange, name, min, max, step } = this.props;
        return (
            <div className="row">
                <div className="col s11 m11">
                    <div className="range-field">
                        <h6 htmlFor="std" className="black-text">
                            {title}
                            <input onChange={onChange} value={value} type="range" name={name} min={min || 0} max={max || 100} step={step || 5} />
                        </h6>
                    </div>
                </div>
                <div className="col s1 m1">
                    <h5 id="std-value">{value}{name==="test_size_percentage"&&"%"}</h5>
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
                <select onChange={this.props.onChange} name="target_column" className="browser-default" required>
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
        columns: null,
        target_column: "",
        sigma: 0.5,
        test_size_percentage: 30,
        isTraining: false,
        isTrained: false,
        mse: null,
        r2: null
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

    handleChange = e => {
        console.log("onchange called")
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit = e => {
        const { target_column, sigma, test_size_percentage } = this.state;
        const form_values = {target_column, sigma, test_size_percentage}
        this.setState({isTraining: true})
        e.preventDefault();
        // Send POST request with form data as body
        fetch("/train_model", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(form_values)
        })
        .then(res => res.json())
        .then(data => {
            // Save error variables to state after training
            this.setState({
                mse: data.mse,
                r2: data.r2,
                isTraining: false,
                isTrained: true
            })
        });
    }

    render() {
        return (
            <div>
                <h4>Configure Model Parameters</h4>
                {this.state.isLoading && <h1><Loader /></h1>}
                <form onSubmit={this.handleSubmit}>
                {this.state.hasData &&
                    <FeatureSelector
                        optionList={this.state.columns} 
                        onChange={this.handleChange}
                    />
                }
                <Slider
                    title="Smoothing Factor (σ)"
                    name="sigma"
                    value={this.state.sigma}
                    min="0" max="1" step=".01"
                    onChange={this.handleChange}
                    />
                <Slider
                    title="Test Set Ratio (%)"
                    name="test_size_percentage"
                    value={this.state.test_size_percentage} 
                    min="0" max="100" step="1"
                    onChange={this.handleChange}
                />
                <a href="/dataview" className="btn grey darken-2">Back to Data View</a>
                <button type="submit" className="btn right">Continue</button>
                </form>
                {this.state.isTraining && <h1><Loader /></h1>}
                {!this.state.isTraining && this.state.isTrained && 
                <div>
                    <h4>Results</h4>
                    <h6><b>MSE:</b> {this.state.mse}</h6>
                    <h6><b>R2:</b> {this.state.r2}</h6>
                </div>}
            </div>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById("root"))