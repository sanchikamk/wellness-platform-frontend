import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export function UpdateDialog({ selectedAppointment, setUpdateAppointment }) {
  const [open, setOpen] = useState(true);
  const [appointment, setAppointment] = useState(selectedAppointment);

  const setAvailabilityTime = (e) => {
    const from = e.target.value;
    const [hour, minute, meridian] = from.match(/(\d+):(\d+) (\w+)/).slice(1);

    let h = parseInt(hour);
    let m = parseInt(minute);

    if (meridian === "PM" && h !== 12) h += 12;
    if (meridian === "AM" && h === 12) h = 0;

    m += 30;
    if (m >= 60) {
      h += 1;
      m -= 60;
    }

    const toHour = h % 12 || 12;
    const toMeridian = h >= 12 ? "PM" : "AM";
    const toTime = `${toHour}:${m.toString().padStart(2, "0")} ${toMeridian}`;

    setAppointment({
      ...appointment,
      appointmentTimings: {
        ...appointment.appointmentTimings,
        from,
        to: toTime,
      },
    });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate.toISOString().split("T")[0];
  };

  const handleUpdateClick = () => {
    setUpdateAppointment(appointment, "update");
  };
  return (
    <Dialog open={open} onClose={() => {}} className="relative z-10">
      <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel transition className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Update Appointment
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                            </svg>
                          </span>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={appointment?.appointmentTimings?.day}
                            min={getMinDate()}
                            max={getMaxDate()}
                            onChange={(e) =>
                              setAppointment((prev) => ({
                                ...prev,
                                appointmentTimings: {
                                  ...prev.appointmentTimings,
                                  day: e.target.value,
                                },
                              }))
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />{" "}
                        </div>
                        {/* {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>} */}
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Select Time</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 1a11 11 0 1 0 11 11A11.012 11.012 0 0 0 12 1zm0 20a9 9 0 1 1 9-9a9.01 9.01 0 0 1-9 9zm.5-13h-1v6l5.25 3.15l.5-.86l-4.75-2.79z" />
                            </svg>
                          </span>
                          <select id="time" name="from" value={appointment?.appointmentTimings?.from} onChange={(e) => setAvailabilityTime(e)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select a time</option>
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="button" onClick={() => handleUpdateClick()} className="inline-flex w-full justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 sm:ml-3 sm:w-auto">
                Update
              </button>
              <button type="button" data-autofocus onClick={() => setUpdateAppointment(null, "cancel")} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
