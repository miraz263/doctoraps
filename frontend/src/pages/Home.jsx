export default function Home() {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Doctor APS</h1>
        <p className="text-gray-600 mb-6">Manage your doctors, patients, appointments, and prescriptions.</p>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Doctors</h2>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Patients</h2>
            <p className="text-3xl font-bold mt-2">34</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Appointments</h2>
            <p className="text-3xl font-bold mt-2">20</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Prescriptions</h2>
            <p className="text-3xl font-bold mt-2">15</p>
          </div>
        </div>
      </div>
    );
  }
  