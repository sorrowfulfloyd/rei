### Frontend TODO

#### Future
- Spice it up with CSS
- Add .env support and tie the server name to it
- Add a demo login
- Form validation for adding a new Device

#### Maybe
- Add owner name reference to device document when it's created in the server and show it as read-only in the list maybe?

#### Done
- Cleaned up and fixed bugs in the parser
- Bind amount of devices to their owners then display 
- Pull n amount per request and page it 
- Delete device
- Modal to edit devices
- Make the device type and status dynamic (easily changable with droplist)
- Modal to edit customers(show owned devices as read-only when there)
- Unbind the device from customer in server when deleted (owner's id dies with it but still have to delete the device id from customer's array!!!)
- When deleting a customer also delete all their devices
- While adding a device, add support for adding to existing owner
- Hide the sensible parts (Technician name, owner id etc.) from the frontend
- On list all devices;
  - filter the devices by status or device type
  - sort by accept date (asc,desc)
- Add a reset button or a href for clean search again

#### Later goals
