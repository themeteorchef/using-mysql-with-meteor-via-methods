import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Bert } from 'meteor/themeteorchef:bert';
import DocumentEditor from '../../components/DocumentEditor/DocumentEditor';
import NotFound from '../NotFound/NotFound';

class EditDocument extends React.Component {
  componentWillUnmount() {
    this.props.awaitingMethod.set(true);
    this.props.currentDoc.set({});
  }

  render() {
    const { loading, doc, history } = this.props;
    return (!loading && doc ? (
      <div className="EditDocument">
        <h4 className="page-header">{`Editing "${doc.title}"`}</h4>
        <DocumentEditor doc={doc} history={history} />
      </div>
    ) : <NotFound />);
  }
}

EditDocument.propTypes = {
  loading: PropTypes.bool.isRequired,
  awaitingMethod: PropTypes.object.isRequired,
  currentDoc: PropTypes.object.isRequired,
  doc: PropTypes.object.isRequired,
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
}, EditDocument);
