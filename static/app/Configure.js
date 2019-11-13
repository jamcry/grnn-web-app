const SubmitButton = ({ name }) => (
    <button className="btn waves-effect waves-light" type="submit" name="action">
        <i className="material-icons right">send</i>{name}
    </button>
)

const Loader = () => (
    <div className="container" style={{ textAlign: "center", padding: "2rem" }}>
        <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
            </div>
        </div>
        <p className="flow-text">Loading...</p>
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
        r2: null,
        plot_html: null,
        train_error: null
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
            console.log(data)
            // Save error variables to state after training
            this.setState({
                mse: data.mse,
                r2: data.r2,
                fig_encoded: data.fig_encoded,
                train_error: data.train_error,
                isTraining: false,
                isTrained: true
            }, console.log(this.state))
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
                <a href="/dataview" className="btn grey darken-2">Back to Data View
                <i className="material-icons left">chevron_left</i></a>
                <button type="submit" className="btn right">Continue
                <i className="material-icons right">chevron_right</i></button>
                </form>
                <br/><hr/>
                {this.state.isTraining && <div className="col s6 m6"><Loader /></div>}
                {!this.state.train_error && !this.state.isTraining && this.state.isTrained && 
                    <div className="flow-text">
                        <h4>Model Error Scores</h4>
                        <ul className="collection">
                            <li className="collection-item">
                                <b>MSE:</b> {this.state.mse}
                            </li>
                            <li className="collection-item">
                                <b>R^2:</b> {this.state.r2}
                            </li>
                        </ul>
                        <h4>Scatter Plot</h4>
                        <img className="responsive-img" src={"data:image/png;base64," + this.state.fig_encoded}/>
                    </div>
                }
                { // Handle errors
                    this.state.train_error &&
                    <div>
                    <h4>Model returned error</h4>
                    <p>Error: </p>
                    <blockquote>
                        {this.state.train_error}
                    </blockquote>
                    </div>
                }
            </div>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById("root"))