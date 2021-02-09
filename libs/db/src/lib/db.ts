import * as mongoose from 'mongoose';
import { BookingRecord, Id } from '@triton/common';

export type BookingDocument<T> = BookingRecord<T> & mongoose.Document;

const RecordSchema = new mongoose.Schema({
  action: {
    type: String,
    default: 'UNKNOWN',
    enum: ['CREATE', 'UPDATE', 'DELETE', 'UNKNOWN'],
  },
  date: {
    type: Date,
    default: new Date(),
  },
  origin: {
    type: String,
    index: true,
    enum: ['yclients', 'musbooking'],
  },
  internalId: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  externalId: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  source: {
    required: true,
    type: Object,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: null,
  },
});

const RecordModel = mongoose.model<BookingDocument<unknown>>(
  'Record',
  RecordSchema
);

export const exists = (item: BookingRecord) =>
  RecordModel.findOne({
    internalId: item.internalId,
    origin: item.origin,
  }).then((doc) => doc !== null);

export const create = (item: BookingRecord) => new RecordModel(item).save();

export const createMultiple = (items: Array<BookingRecord>) =>
  RecordModel.insertMany(items);

export const update = <T>(
  itemId: string,
  fields: Partial<BookingDocument<T>> = {}
) => RecordModel.updateOne({ _id: itemId }, fields);

export const markCompleted = (itemId: string, externalId: Id) =>
  update(itemId, { externalId, completed: true });

export const markCompletedWithError = (itemId: string, message: string) =>
  update(itemId, { completed: true, error: true, errorMessage: message });

export const findPendingItems = (serviceId: string) =>
  RecordModel.find({
    origin: { $ne: serviceId },
    action: { $in: ['CREATE', 'DELETE'] },
    completed: false,
  });

export const findPreviouslyCreatedItem = (serviceId: string, externalId: Id) =>
  RecordModel.findOne({
    externalId,
    origin: { $ne: serviceId },
    internalId: { $ne: null },
    action: 'CREATE',
    completed: true,
    error: false,
  });

export const connect = () =>
  mongoose
    .connect(
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.MONGO_INITDB_DATABASE,
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
      }
    )
    .then(() => {
      console.log(
        `Connected to MongoDB at ${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`
      );
    });
