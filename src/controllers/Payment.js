import { randomUUID } from "node:crypto";
import api from "../config/api.js";
import  User  from "../../db/UserModel.js";
import PaymentModel from "../../db/paymentModel.js";

const createOrder = async (req,  res) => {
	console.log('ok')
	
	const user = "";
	MongoClient.connect(uri, async function(err, client) {
		if(err){
		  console.log(err);      
		  next();
		}
		var collection = client.db("isaac").collection("convenios").find(query);
		var documentArray = await collection.toArray();
		data = documentArray;
	  });
	  User.findById(request.params.idUser.trim())
	  .then((userFound) => {user = userFound});
	

	if (!user) {
		return res.json({ error: 'Usuário não encontrado!' })
	}

	const dataDTO = req.body

	const refId = randomUUID()

	const payment = await PaymentModel.create({
		user_id: user.id,
		reference_id: refId,
		item: {
			description: dataDTO.item.description,
			transaction_amount: dataDTO.item.transaction_amount
		},
		status: 'pendente'
	})

	if (!payment) {
		return res.json({ error: 'Erro ao criar pagamento!' })
	}

	const dataValues = {
		transaction_amount: dataDTO.item.transaction_amount,
		description: dataDTO.item.description,
		payment_method_id: "pix",
		payer: {
			email: dataDTO.payer.email,
			first_name: dataDTO.payer.first_name,
			last_name: dataDTO.payer.last_name,
			identification: {
				type: "CPF",
				number: dataDTO.payer.cpf
			},
			address: {
				zip_code: dataDTO.payer.zip_code,
				street_name: dataDTO.payer.street_name,
				street_number: dataDTO.payer.street_number,
				neighborhood: dataDTO.payer.neighborhood,
				city: dataDTO.payer.city,
				federal_unit: dataDTO.payer.federal_unit
			}
		},
		external_reference: refId,
		// notification_url: "https://2fea-187-111-164-64.sa.ngrok.io/api/callback"
		notification_url: "https://mercadopago-server.herokuapp.com/api/callback"
	}

	const { data } = await api.post('/v1/payments', dataValues)
	if (data) {
		res.json(data)
	} else {
		res.json('Erro ao criar pagamento!')
	}
}

const getPayment = async (req, res) => {
	const payment = await PaymentModel.findOne({ reference_id: req.body.external_reference })
	if (payment) {
		if(payment.status === 'aprovado'){
		return res.json('approved')
}
	}
	return res.json('pending')
}

const callback = async (req, res) => {
	if (req.body.action === 'payment.updated') {
		const { data } = await api.get(`/v1/payments/${req.body.data.id}`)
		// se no data o status vier 'approved', então modificar essa transação em específico do cliente no banco de dados, e alterar no frontend 
		console.log(data)

		const payment = await PaymentModel.findOne({ reference_id: data.external_reference })

		if (payment) {
			if (data.status === 'approved') {
				payment.status = 'aprovado'
				await PaymentModel.updateOne({ reference_id: data.external_reference }, payment, { new: true })
				return res.send({ message: `Pedido: ${data.external_reference} pago com sucesso!` })
			}
		}

	}
	res.json('callback')
}


export {
	createOrder,
	callback,
	getPayment
}