# Base url: http://192.168.198.174:5000/

## API Endpoint

*PATCH* /cart/:id

### Request Parameters

- id (path parameter) - The unique ID of the cart item to update.

### Request Body (JSON)

| Field    | Type    | Description                                                    |
| -------- | ------- | -------------------------------------------------------------- |
| quantity | Integer | The number to add (+) or remove (-) from the current quantity. |

### Request Example

#### *Increase Quantity (+1)*

http
PATCH /cart/65da0465c5db158a7f9f7a04
Content-Type: application/json


json
{
  "quantity": 1
}


#### *Decrease Quantity (-1)*

json
{
  "quantity": -1
}


---

## Response Examples

### ✅ *Cart Updated Successfully*

json
{
  "message": "Cart updated successfully",
  "newQuantity": 4,
  "newTotalPrice": 180
}
