### Frontend TODO

#### Current tasks
- Pie charts and graphs

#### Future tasks (DO IT IN ORDER FUTURE ME, PLEASE)
- Form validation for adding a new Device
- SMS/WhatsApp message support
- Look for a better Listing tools or smth
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
- Calendar support for daily updates
  - [x] While adding a device, add that device to calendar list.
  - [x] Only list the devices with "Ongoing" status in the calendar
  - [x] Let the user select the calendar start and end date while adding the device
  - [x] Figure out a way to parse the devices into the calendar.
  - [x] Edit devices calendar start and end dates
  - [x] Provide comprehensive event descriptions for calendar
  - [?] Edit calendar's appearence (get rid of agenda view) -looks good for now, but come back to it for now-
  - [ ] Make the users aware that changing the device's status removes it from the calendar 

#### QoL
- Don't let the users schedule a repair for already booked hours

#### Known bugs
- Shown page does not automatically fallback to previous page when the current one gets emptied
