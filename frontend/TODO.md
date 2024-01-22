### Frontend TODO

#### Current tasks
- Calendar support for daily updates
  - Figure out a way to parse the devices into the calendar.
  - While adding a device, add that device to calendar list.
    - Only list the devices with "Ongoing" status in the calendar
  - Edit calendar's appearence to suit our needs

#### Future tasks (DO IT IN ORDER FUTURE ME, PLEASE)
- Pie charts and graphs
- Form validation for adding a new Device
- SMS/WhatsApp message support
- Carry it onto Bootstrap or Tailwind
- Localization support

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
- Add .env support and tie the server name to it
- Spice it up with some basic CSS
- Add a demo login

#### Known bugs
- Shown page does not automatically fallback to previous page when the current one gets emptied
