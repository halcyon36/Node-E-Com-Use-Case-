const WarehouseList = ()=>
{
    return JSON.parse(`[
        {
          "WarehouseName": "Warehouse A",
          "WarehouseDescription": "This is Warehouse A",
          "WarehouseLocation": "123 Main St",
          "WarehouseZipcode": "12345",
          "WarehouseCity": "New York",
          "WarehouseState": "NY",
          "WarehouseCountry": "USA"
        },
        {
          "WarehouseName": "Warehouse B",
          "WarehouseDescription": "This is Warehouse B",
          "WarehouseLocation": "456 Elm St",
          "WarehouseZipcode": "67890",
          "WarehouseCity": "Los Angeles",
          "WarehouseState": "CA",
          "WarehouseCountry": "USA"
        }
      ]
      `)
}
export default WarehouseList