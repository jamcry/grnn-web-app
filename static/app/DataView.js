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
                            <div className="col s12 m12">
                                {// !!!! WARNING: HTML parsing is vulnerable to XSS. Just for development! 
                                }
                                <div dangerouslySetInnerHTML={{ __html: dataAsTableHTML }} />
                            </div>
                        </div>
                        <div className="row flow-text">
                            <div className="col s12 m8 l8">
                                <h4>Columns</h4>
                                <ul className="collection">
                                {columns.map(col => (
                                    <div className="chip" key={"li_" + col}>
                                        {col}
                                    </div>
                                ))}
                                </ul>
                            </div>
                            <div className="col s12 m4 l4">
                                <h4>Sizes</h4>
                                <ul className="collection">
                                    <li className="collection-item">
                                    <span class="new badge right white-text" style={{fontSize:"1.5rem",fontWeight:"bold"}} data-badge-caption="">{shape[1]}</span>
                                        Features
                                    </li>
                                    <li className="collection-item">
                                    <span class="new badge right white-text grey darken-2" style={{fontSize:"1.5rem",fontWeight:"bold"}} data-badge-caption="">{shape[0]}</span>
                                        Rows
                                    </li>
                                </ul>
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
            <a href="/" className="btn grey darken-2">Back to Upload
            <i className="material-icons left">chevron_left</i></a>
            <a href="/configure" className="btn right">Continue
            <i className="material-icons right">chevron_right</i></a>
        </div>
    )
}

ReactDOM.render(<Main />, document.getElementById("root"))