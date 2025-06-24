import { dbClient } from "@/integrations/db";
import { ticketStatus } from "@/integrations/db/shared";
import {
	categories,
	clients,
	installmentPayments,
	installmentPlans,
	payments,
	products,
	ticketItems,
	tickets,
} from "@/integrations/db/tables";
import { faker } from "@faker-js/faker";

function generateCategories() {
	const names = new Set<string>();

	while (names.size <= 5) {
		names.add(faker.commerce.department());
	}

	return Array.from({ length: 5 }).map((_, i) => {
		const date = new Date(new Date().getTime() + i * 1000);
		return {
			id: i + 1,
			name: Array.from(names)[i],
			description: faker.food.description(),
			createdAt: date,
			updatedAt: date,
		};
	});
}

function generateProducts(categoriesIds: number[]) {
	return Array.from({ length: 200 }).map((_, i) => {
		const costPrice = faker.number.int({
			min: 100,
			max: 100000,
		});

		const stock = faker.number.int({ min: 10, max: 200 });
		const date = new Date(new Date().getTime() + i * 1000);

		return {
			id: i + 1,
			description: faker.commerce.productName(),
			barcode: faker.commerce.isbn(),
			costPrice: costPrice,
			salePrice: Math.floor(costPrice + costPrice * 0.3),
			wholesalePrice: Math.floor(costPrice + costPrice * 0.2),
			categoryId: faker.helpers.arrayElement(categoriesIds),
			stock,
			minStock: Math.floor(stock * 0.01),
			createdAt: date,
			updatedAt: date,
		};
	});
}

function generateClients() {
	return Array.from({ length: 20 }).map((_, i) => {
		const date = new Date(new Date().getTime() + i * 1000);

		return {
			fullName: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			address: faker.location.streetAddress(),
			creditLimit: faker.number.int({ min: 10000000, max: 50000000 }),
			clientCode: faker.database.mongodbObjectId(),
			createdAt: date,
			updatedAt: date,
		};
	});
}

function generateTickets(
	products: ReturnType<typeof generateProducts>,
	clientIds: string[],
) {
	const data = Array.from({ length: 50 }).map((_, index) => {
		const date = new Date(new Date().getTime() + index * 1000);

		const ticketsItemsData: (typeof ticketItems.$inferInsert)[] = Array.from({
			length: faker.number.int({
				max: 2,
				min: 1,
			}),
		}).map(() => {
			const quantity = faker.number.int({
				min: 1,
				max: 10,
			});

			const product = faker.helpers.arrayElement(products);

			return {
				quantity,
				description: product.description,
				price: product.salePrice,
				productId: product.id,
				subtotal: product.salePrice * quantity,
				ticketId: index + 1,
				createdAt: date,
				updatedAt: date,
			};
		});

		const ticketData: typeof tickets.$inferInsert = {
			status: faker.helpers.arrayElement(ticketStatus),
			total: ticketsItemsData.reduce((acc, ti) => acc + ti.subtotal, 0),
			clientId: faker.helpers.arrayElement(clientIds),
			id: index + 1,
			createdAt: date,
			updatedAt: date,
		};

		return {
			ticketsItemsData,
			ticketData,
		};
	});

	return {
		tickets: data.flatMap((d) => d.ticketData),
		items: data.flatMap((d) => d.ticketsItemsData),
	};
}

async function seed() {
	const categoriesData = generateCategories();
	const clientsData = generateClients();
	const productsData = generateProducts(categoriesData.map((c) => c.id));

	await dbClient.client.delete(payments);
	await dbClient.client.delete(installmentPayments);
	await dbClient.client.delete(installmentPlans);
	await dbClient.client.delete(ticketItems);
	await dbClient.client.delete(tickets);
	await dbClient.client.delete(products);
	await dbClient.client.delete(categories);
	await dbClient.client.delete(clients);

	//Insert Categories
	await dbClient.client.insert(categories).values(categoriesData);
	//Insert Products
	await dbClient.client.insert(products).values(productsData);
	//Insert Clients
	const createdClients = await dbClient.client
		.insert(clients)
		.values(clientsData)
		.returning({ id: clients.id });

	const clientIds = createdClients.map((c) => c.id);

	//const ticketsData = generateTickets(productsData, clientIds);

	//await dbClient.client.insert(tickets).values(ticketsData.tickets);
	//await dbClient.client.insert(ticketItems).values(ticketsData.items);
}

seed();
