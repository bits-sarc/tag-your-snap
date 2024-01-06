import { Outlet } from 'react-router-dom';
import { createContact, getContacts } from '../contacts';
// import { Contact } from '../types/contact';
import NavBar from '../components/NavBar';

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}

export async function action() {
  const contact = await createContact();
  return { contact };
}

export default function Root() {
  // const { contacts } = useLoaderData() as { contacts: Contact[] };
  return (
    <div className='bg-black text-white'>
      <NavBar />
      <Outlet />
    </div>
  );
}