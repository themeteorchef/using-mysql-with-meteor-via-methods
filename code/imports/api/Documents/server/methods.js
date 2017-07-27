import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { findOne, find, insert, update, remove } from '../../../modules/server/mysql';
import rateLimit from '../../../modules/rate-limit';

Meteor.methods({
  documents: function documentsInsert() {
    try {
      return find(`SELECT * FROM documents WHERE owner = '${this.userId}'`)
      .then(result => result)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'documents.view': function documentsInsert(documentId) {
    check(documentId, String);

    try {
      return findOne(`SELECT * FROM documents WHERE _id = ${documentId} AND owner = '${this.userId}'`)
      .then(result => result)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'documents.insert': function documentsInsert(doc) {
    check(doc, {
      title: String,
      body: String,
    });

    try {
      const docToInsert = doc;
      docToInsert.owner = this.userId;
      return insert('documents', docToInsert)
      .then(result => result)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'documents.update': function documentsUpdate(doc) {
    check(doc, {
      _id: Number,
      title: String,
      body: String,
    });

    try {
      return update('documents', doc._id, doc)
      .then(() => doc._id)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'documents.remove': function documentsRemove(documentId) {
    check(documentId, Number);

    try {
      return remove('documents', documentId)
      .then(result => result)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'documents.insert',
    'documents.update',
    'documents.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
