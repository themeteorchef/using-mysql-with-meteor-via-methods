import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { Bert } from 'meteor/themeteorchef:bert';
import Loading from '../../components/Loading/Loading';

import './Documents.scss';

class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillUnmount() {
    this.props.awaitingMethod.set(true);
    this.props.currentDocuments.set([]);
  }

  handleRemove(documentId) {
    const { awaitingMethod } = this.props;
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call('documents.remove', documentId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Document deleted!', 'success');
          awaitingMethod.set(true);
        }
      });
    }
  }

  render() {
    const { loading, documents, match, history } = this.props;
    return (!loading ? (
      <div className="Documents">
        <div className="page-header clearfix">
          <h4 className="pull-left">Documents</h4>
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Document</Link>
        </div>
        {documents.length ? <Table responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Last Updated</th>
              <th>Created</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {documents.map(({ _id, title, createdAt, updatedAt }) => (
              <tr key={_id}>
                <td>{title}</td>
                <td>{timeago(updatedAt)}</td>
                <td>{monthDayYearAtTime(createdAt)}</td>
                <td>
                  <Button
                    bsStyle="primary"
                    onClick={() => history.push(`${match.url}/${_id}`)}
                    block
                  >View</Button>
                </td>
                <td>
                  <Button
                    bsStyle="danger"
                    onClick={() => this.handleRemove(_id)}
                    block
                  >Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table> : <Alert bsStyle="warning">No documents yet!</Alert>}
      </div>
    ) : <Loading />);
  }
}

Documents.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentDocuments: PropTypes.object.isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  awaitingMethod: PropTypes.object.isRequired,
};

const awaitingMethod = new ReactiveVar(true);
const currentDocuments = new ReactiveVar([]);

export default createContainer(() => {
  const loading = awaitingMethod.get();

  if (loading) {
    Meteor.call('documents', (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        currentDocuments.set(response);
        awaitingMethod.set(false);
      }
    });
  }

  return {
    loading,
    awaitingMethod,
    currentDocuments,
    documents: currentDocuments.get(),
  };
}, Documents);
