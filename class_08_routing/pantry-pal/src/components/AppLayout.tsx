import { Outlet } from 'react-router-dom';
import NavBar from './Navbar';
import { ThemeShell } from './ThemeShell';

function AppLayout() {
	return (
		<ThemeShell>
			<NavBar />
			<main className='mx-auto max-w-6xl px-6 py-10'>
				<Outlet />
			</main>
		</ThemeShell>
	);
}

export default AppLayout;
