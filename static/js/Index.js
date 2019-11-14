const SubmitButton = ({ name }) => (
  <button className="btn waves-effect waves-light right" type="submit" name="action">
    <i className="material-icons right">send</i>{name}
  </button>
)

const PreviousDatasetAlert = () => (
  <div className="row">
    <div className="col s12 m12">
      <div className="card-panel orange">
        <p className="white-text">
          <b>
            Previously updated dataset found! You can use it.
          </b>
        </p>
        <div className="row right">

          <a href="/reset" className="btn red darken-2 white-text">REMOVE
          <i className="material-icons left">delete</i></a>
          {" "}
          <a href="/dataview" className="btn blue lighten-1 white-text">Check Dataset
          <i className="material-icons left">find_in_page</i></a>
        </div>
      </div>
    </div>
  </div>

)

class CSVUploader extends React.Component {
  state = {
    datasetExists: false
  }
  componentDidMount = () => {
    const dataset_exists = document.getElementById("root").getAttribute("dataset-exists")
    this.setState({
      datasetExists: dataset_exists === "True"
    })
  }
  render() {
    return (
      <div>
        <div className="csv-upload row">
          { this.state.datasetExists && <PreviousDatasetAlert /> }
          <h4>Upload Dataset</h4>
          <p>
            Select and submit a dataset with csv extension to use in GRNN model. 
          </p>
          <form action="/loadcsv" method="post" className="col m12 s12" encType="multipart/form-data">
            <div className="file-field input-field">
              <div className="btn grey darken-2">
                <span>
                  Select CSV
                  <i className="material-icons left">queue</i>
                </span>
                <input type="file" name="csv_file" />
              </div>
              <div className="file-path-wrapper row">
                <input className="file-path validate" type="text" />
                <SubmitButton name="Submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const Main = () => {
  return (
    <div>
      <CSVUploader />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById("root"))