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

class DataViewer extends React.Component {
    state = {
        isLoading: false,
        hasData: false,
        dataAsTableHTML: null
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
        const { isLoading, hasData, dataAsTableHTML, columns, shape } = this.state;
        return (
            <div>
                {isLoading && <Loader />}
                {!hasData ? <p>No data found.</p>
                    :
                    <div>
                        <div className="row">
                            <div className="col">
                                {// !!!! WARNING: HTML parsing is vulnerable to XSS. Just for development! 
                                }
                                <div dangerouslySetInnerHTML={{ __html: dataAsTableHTML }} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <h6>Columns</h6>
                                {columns.map(col => <li key={"li_" + col}>{col}</li>)}
                            </div>
                            <div className="col">
                                <h6>Sizes</h6>
                                <p><b><span className="badge green white-text">{shape[1]}</span>Features</b></p>
                                <p><b><span className="badge">{shape[0]}</span>Rows</b></p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const Main = () => {
    return (
        <div>
            <h4>Check Your Data</h4>
            <DataViewer />
            <a href="/" className="btn grey darken-2">Back to Upload</a>
            <a href="/configure" className="btn right">Continue</a>
        </div>
    )
}

ReactDOM.render(<Main />, document.getElementById("root"))