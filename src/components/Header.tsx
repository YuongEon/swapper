import React from 'react'

const navData = [
	{
		title: 'Swap',
		sectionId: 'swap',
	},
	{
		title: 'Tutorial',
		sectionId: 'tutorial',
	},
	{
		title: 'Contact',
		sectionId: 'contact',
	},
]

const Header = () => {
	return (
		<div className="flex flex-row justify-between min-h-[60px] items-center">
			<h3 className="uppercase text-[30px] text-white font-semibold">
				<span className="text-main-light">S</span>wapper
			</h3>
			<Nav />
		</div>
	)
}

export default Header

const Nav = () => {
	return (
		<nav>
			<ul className="flex flex-row gap-[40px] text-white font-medium">
				{navData.map((item) => (
					<NavItem
						key={item.sectionId}
						sectionId={item.sectionId}
						title={item.title}
					/>
				))}
			</ul>
		</nav>
	)
}

interface TNavItem {
	title: string
	sectionId: string
}
const NavItem = (props: TNavItem) => {
	const { title, sectionId } = props
	return (
		<li>
			<a
				href={`#${sectionId}`}
				className="block w-full h-full hover:text-main-light relative transition-all after:content-[''] after:absolute after:h-[2px] after:w-0 after:hover:w-full after:bg-main-light after:bottom-0 after:left-0 after:transition-all"
			>
				{title}
			</a>
		</li>
	)
}
