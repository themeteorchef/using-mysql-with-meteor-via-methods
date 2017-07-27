import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

class ViewDocument extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
    this.renderDocument = this.renderDocument.bind(this);
  }

  componentWillUnmount() {
    this.props.awaitingMethod.set(true);
    this.props.currentDoc.set({});
  }

  handleRemove() {
    const { doc, history } = this.props;
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call('documents.remove', doc._id, (error, response) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Document deleted!', 'success');
          if (response) history.push('/documents');
        }
      });
    }
  }

  renderDocument() {
    const { doc, match, history } = this.props;
    return (doc ? (
      <div className="ViewDocument">
        <div className="page-header clearfix">
          <h4 className="pull-left">{ doc && doc.title }</h4>
          <ButtonToolbar className="pull-right">
            <ButtonGroup bsSize="small">
              <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
              <Button
                onClick={() => this.handleRemove()}
                className="text-danger"
              >
                Delete
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        { doc && doc.body }
      </div>
    ) : <NotFound />);
  }

  render() {
    return (!this.props.loading ? this.renderDocument() : <Loading />);
  }
}

ViewDocument.propTypes = {
  loading: PropTypes.bool.isRequired,
  awaitingMethod: PropTypes.object.isRequired,
  currentDoc: PropTypes.object.isRequired,
  doc: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const awaitingMethod = new ReactiveVar(true);
const currentDoc = new ReactiveVar({});

export default createContainer(({ match }) => {
  const documentId = match.params._id;
  const loading = awaitingMethod.get();

  if (loading) {
    Meteor.call('documents.view', documentId, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        currentDoc.set(response);
        awaitingMethod.set(false);
      }
    });
  }

  return {
    loading,
    awaitingMethod,
    currentDoc,
    doc: currentDoc.get(),
  };
}, ViewDocument);
