import mongoose from 'mongoose';
const { Schema } = mongoose;

const itemsSchema = new Schema({
	description: { type: String, required: true },
	transaction_amount: { type: Number, required: true },
});


const paymentSchema = new Schema({
	reference_id: { type: String, required: true },
	user_id: { type: Schema.Types.ObjectId, required: true },
	item: { type: itemsSchema, required: true },
	status: { type: String, required: true },
});


const PaymentModel = ('Payment', paymentSchema);
export default PaymentModel;