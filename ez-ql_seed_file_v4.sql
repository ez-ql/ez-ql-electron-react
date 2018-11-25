/*
Seed file for ez*ql database
*/

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR (50) NOT NULL
);

CREATE TABLE databases (
  database_id SERIAL PRIMARY KEY,
  database_name VARCHAR (50) NOT NULL,
  organization_id INT NOT NULL,
  FOREIGN KEY (organization_id)
	REFERENCES organizations (organization_id)
	ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR (50) NOT NULL,
  database_id INT NOT NULL,
  FOREIGN KEY (database_id)
	REFERENCES databases (database_id)
	ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE models (
  model_id SERIAL PRIMARY KEY,
  database_id INT NOT NULL,
  model_name VARCHAR (50),
  FOREIGN KEY (database_id)
	REFERENCES databases (database_id)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE fields (
  field_id SERIAL PRIMARY KEY,
  model_id INT NOT NULL,
  field_name VARCHAR (50),
  field_type VARCHAR (10),
  field_example VARCHAR (50),
  FOREIGN KEY (model_id)
	REFERENCES models (model_id)
	ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE foreignKeys (
  foreignKey_id SERIAL PRIMARY KEY,
  model_id INT NOT NULL,
  relatedModel_id INT NOT NULL,
  model_foreign_field VARCHAR (50) not NULL, 
  relatedModel_primary_field VARCHAR (50) not NULL,
  FOREIGN KEY (model_id)
  	REFERENCES models (model_id)
	ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (relatedModel_id)
	REFERENCES models (model_id)
	ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  organization_id INT NOT NULL,
  user_password VARCHAR (50) NOT NULL,
  user_email VARCHAR (50) NOT NULL,
  user_firstName VARCHAR (50) NOT NULL,
  user_lastName VARCHAR (50) NOT NULL,
  is_admin BOOLEAN,
  FOREIGN KEY (organization_id)
	REFERENCES organizations (organization_id)
	ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE queries (
  query_id SERIAL PRIMARY KEY,
  query_text TEXT NOT NULL
);

CREATE TABLE searches (
search_id SERIAL PRIMARY key,
search_text VARCHAR (50)
);

CREATE TABLE userQueries (
  userQuery_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  query_id INT NOT NULL,
  query_name VARCHAR (50),
  project_id INT NOT NULL,
  search_id INT,
  FOREIGN KEY (user_id) 
 	REFERENCES users (user_id) 
	ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (query_id) 
        REFERENCES queries (query_id) 
        ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (project_id) 
 	REFERENCES projects (project_id) 
	ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (search_id) 
        REFERENCES searches (search_id) 
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE joinInstances (
  join_id SERIAL PRIMARY KEY,
  mainModel_id INT NOT NULL,
  joinedModel_id INT NOT NULL,
  join_type VARCHAR(10) NOT NULL,
  user_id INT NOT NULL,
  query_id INT NOT NULL,
  FOREIGN KEY (mainModel_id)
	REFERENCES models (model_id)
	ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (joinedModel_id)
	REFERENCES models (model_id)
	ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (user_id)
	REFERENCES users (user_id)
	ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (query_id)
	REFERENCES queries (query_id)
	ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE userModels (
  userModel_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  model_id INT NOT NULL,
  FOREIGN KEY (user_id) 
 	REFERENCES users (user_id) 
	ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (model_id) 
        REFERENCES models (model_id) 
        ON DELETE NO ACTION ON UPDATE CASCADE  
);

CREATE TABLE userFields (
  userField_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  field_id INT NOT NULL,
  FOREIGN KEY (user_id) 
 	REFERENCES users (user_id) 
	ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (field_id) 
        REFERENCES fields (field_id) 
        ON DELETE NO ACTION ON UPDATE CASCADE  
);

INSERT INTO organizations(organization_name) VALUES('Alpha');
INSERT INTO organizations(organization_name) VALUES('Beta');

INSERT INTO databases(database_name, organization_id) VALUES('BikeStores',1);

INSERT INTO projects(project_name, database_id) VALUES('Quarterly Sales',1);
INSERT INTO projects(project_name, database_id) VALUES('Customer Retention',1);

INSERT INTO models(database_id, model_name) VALUES(1, 'stores');
INSERT INTO models(database_id, model_name) VALUES(1, 'staffs');
INSERT INTO models(database_id, model_name) VALUES(1, 'categories');
INSERT INTO models(database_id, model_name) VALUES(1, 'brands');
INSERT INTO models(database_id, model_name) VALUES(1, 'products');
INSERT INTO models(database_id, model_name) VALUES(1, 'customers');
INSERT INTO models(database_id, model_name) VALUES(1, 'orders');
INSERT INTO models(database_id, model_name) VALUES(1, 'order_items');
INSERT INTO models(database_id, model_name) VALUES(1, 'stocks');

INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(1, 'store_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(1, 'store_name', 'varchar', 'Santa Cruz Bikes');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(1, 'phone', 'varchar', '(831) 476-4321');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(1, 'email', 'varchar', 'santacruz@bikes.shop');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(1, 'street', 'varchar', '3700 Portola Drive');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(1, 'city', 'varchar', 'Santa Cruz');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(1, 'state', 'varchar', 'CA');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(1, 'zip_code', 'zipcode', 95060);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(2, 'staff_id', 'id', 2);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(2, 'first_name', 'varchar', 'Mireya');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(2, 'last_name', 'varchar', 'Copeland');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(2, 'email', 'varchar', 'mireya.copeland@bikes.shop');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(2, 'phone', 'varchar', '(831) 555-5555');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(2, 'active', 'enum', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(2, 'store_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(2, 'manager_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(3, 'category_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(3, 'category_name', 'varchar', 'Children Bicycles');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(4, 'brand_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(4, 'brand_name', 'varchar', 'Electra');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(5, 'product_id','id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(5, 'product_name', 'varchar', 'Trek 820 - 2016');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(5, 'brand_id','id', 9);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(5, 'category_id', 'id', 6);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(5, 'model_year', 'year', 2016);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(5, 'list_price', 'decimal', 379.99);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'customer_id', 'id', 5);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'first_name', 'varchar', 'Charolette');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'last_name', 'varchar', 'Rice');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'phone', 'varchar', '(916) 381-6003');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'email', 'varchar', 'charolette.rice@msn.com');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'street', 'varchar', '107 River Dr.');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'city', 'varchar', 'Sacramento');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'state', 'varchar', 'CA');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(6, 'zip_code', 'zipcode', 95820);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(7, 'order_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(7, 'customer_id', 'id', 259);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(7, 'order_status', 'enum', 4);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(7, 'order_date', 'date', '2016-01-01');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(7, 'required_date', 'date', '2016-01-03');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(7, 'shipped_date', 'date', '2016-01-03');
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(7, 'store_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(7, 'staff_id', 'id', 2);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(8, 'order_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(8, 'item_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(8, 'product_id', 'id', 20);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(8, 'quantity', 'integer', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(8, 'list_price', 'decimal', 599.99);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(8, 'discount', 'decimal', 0.20);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(9, 'store_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(9, 'product_id', 'id', 1);
INSERT INTO fields(model_id, field_name, field_type, field_example) VALUES(9, 'quantity', 'integer', 27);

INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(2, 1, 'store_id', 'store_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(2, 2, 'staff_id' , 'manager_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(5, 3, 'category_id', 'category_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(5, 4, 'brand_id', 'brand_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(7, 6, 'customer_id', 'customer_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(7, 1, 'store_id', 'store_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(7, 2, 'staff_id', 'staff_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(8, 7, 'order_id', 'order_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(8, 5, 'product_id','product_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(9, 1, 'store_id', 'store_id');
INSERT INTO foreignKeys(model_id, relatedModel_id, model_foreign_field, relatedModel_primary_field) VALUES(9, 5, 'product_id', 'product_id');

INSERT INTO users(organization_id, user_password, user_email, user_firstName, user_lastName, is_admin) VALUES(1, '123', 'emily@alpha.com', 'Emily', 'Lovelace', FALSE); 

INSERT INTO queries(query_text) VALUES('SELECT EXTRACT (MONTH FROM order_date) AS Order_Month, COUNT(order_id) as Total_Orders FROM orders WHERE order_date > DATE ''2015-12-31'' AND order_date < DATE ''2016-04-01'' GROUP BY EXTRACT(MONTH FROM order_date) ORDER BY Order_month');
INSERT INTO queries(query_text) VALUES('SELECT EXTRACT (DAY FROM order_date) AS Sale_Date, SUM(quantity) as Total_Units, SUM((list_price * quantity)) AS Total_Sales FROM orders LEFT JOIN order_items ON orders.order_id = order_items.order_id WHERE order_date > DATE ''2015-12-31'' AND order_date < DATE ''2016-04-01'' GROUP BY EXTRACT(DAY FROM order_date) ORDER BY Sale_Date');
INSERT INTO queries(query_text) VALUES('SELECT brand_name, SUM(quantity) AS Total_Units FROM order_items LEFT JOIN products ON order_items.product_id = products.product_id LEFT JOIN brands on products.brand_id = brands.brand_id WHERE order_date > DATE ''2015-12-31'' AND order_date < DATE ''2016-04-01'' GROUP BY brand_name ORDER BY total_units DESC');
INSERT INTO queries(query_text) VALUES('SELECT first_name, last_name, COUNT(order_id) AS total_orders FROM customers LEFT JOIN orders ON customers.customer_id = orders.customer_id GROUP BY first_name, last_name ORDER BY last_name ASC');
INSERT INTO queries(query_text) VALUES('SELECT total_orders, count(customer_id) as Customer_Count FROM (SELECT customers.customer_id, count(order_id) AS total_orders FROM customers LEFT JOIN orders ON customers.customer_id = orders.customer_id GROUP BY customers.customer_id) AS customer_orders GROUP BY total_orders ORDER BY total_orders ASC');
INSERT INTO queries(query_text) VALUES('SELECT store_id, total_orders, count(customer_id) as Customer_Count FROM (SELECT customers.customer_id, store_id, count(order_id) AS total_orders FROM customers LEFT JOIN orders ON customers.customer_id = orders.customer_id GROUP BY store_id, customers.customer_id) AS customer_orders WHERE total_orders > 2 GROUP BY store_id, total_orders ORDER BY customer_count DESC');

INSERT INTO userQueries(user_id, query_id, project_id, query_name) VALUES(1,1,1,'Total orders by month');
INSERT INTO userQueries(user_id, query_id, project_id, query_name) VALUES(1,2,1,'Total sales by day');
INSERT INTO userQueries(user_id, query_id, project_id, query_name) VALUES(1,3,1,'Most popular brands');
INSERT INTO userQueries(user_id, query_id, project_id, query_name) VALUES(1,4,2,'Number of orders by customer');
INSERT INTO userQueries(user_id, query_id, project_id, query_name) VALUES(1,5,2,'Number of repeat customers');
INSERT INTO userQueries(user_id, query_id, project_id, query_name) VALUES(1,6,2,'Number of three-time customers by store');

INSERT INTO joinInstances(mainModel_id, joinedModel_id, join_type, user_id, query_id) VALUES(7,8, 'left',1,2);
INSERT INTO joinInstances(mainModel_id, joinedModel_id, join_type, user_id, query_id) VALUES(8,5, 'left',1,3);
INSERT INTO joinInstances(mainModel_id, joinedModel_id, join_type, user_id, query_id) VALUES(5,4, 'left',1,3);
INSERT INTO joinInstances(mainModel_id, joinedModel_id, join_type, user_id, query_id) VALUES(6,7,'left',1,5);
INSERT INTO joinInstances(mainModel_id, joinedModel_id, join_type, user_id, query_id) VALUES(6,7,'left',1,5);
INSERT INTO joinInstances(mainModel_id, joinedModel_id, join_type, user_id, query_id) VALUES(6,7,'left',1,6);

INSERT INTO userModels(user_id, model_id) VALUES(1,7);
INSERT INTO userModels(user_id, model_id) VALUES(1,7);
INSERT INTO userModels(user_id, model_id) VALUES(1,8);
INSERT INTO userModels(user_id, model_id) VALUES(1,8);
INSERT INTO userModels(user_id, model_id) VALUES(1,5);
INSERT INTO userModels(user_id, model_id) VALUES(1,4);
INSERT INTO userModels(user_id, model_id) VALUES(1,6);
INSERT INTO userModels(user_id, model_id) VALUES(1,7);
INSERT INTO userModels(user_id, model_id) VALUES(1,6);
INSERT INTO userModels(user_id, model_id) VALUES(1,7);
INSERT INTO userModels(user_id, model_id) VALUES(1,6);
INSERT INTO userModels(user_id, model_id) VALUES(1,7);

INSERT INTO userFields(user_id, field_id) VALUES(1,39);
INSERT INTO userFields(user_id, field_id) VALUES(1,36);
INSERT INTO userFields(user_id, field_id) VALUES(1,39);
INSERT INTO userFields(user_id, field_id) VALUES(1,47);
INSERT INTO userFields(user_id, field_id) VALUES(1,48);
INSERT INTO userFields(user_id, field_id) VALUES(1,20);
INSERT INTO userFields(user_id, field_id) VALUES(1,47);
INSERT INTO userFields(user_id, field_id) VALUES(1,28);
INSERT INTO userFields(user_id, field_id) VALUES(1,29);
INSERT INTO userFields(user_id, field_id) VALUES(1,36);
INSERT INTO userFields(user_id, field_id) VALUES(1,27);
INSERT INTO userFields(user_id, field_id) VALUES(1,36);
INSERT INTO userFields(user_id, field_id) VALUES(1,1);
INSERT INTO userFields(user_id, field_id) VALUES(1,27);
INSERT INTO userFields(user_id, field_id) VALUES(1,36);
