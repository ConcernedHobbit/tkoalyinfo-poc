import { Restaurant as RestaurantData } from '@/server/restaurants';
import { Food } from './Food';

type RestaurantMenuProps = {
	restaurant: RestaurantData;
};

export const Restaurant = ({ restaurant }: RestaurantMenuProps) => (
	<div className="flex min-h-0 w-full flex-col items-center gap-y-4">
		<h1 className="-mb-4 text-4xl">Unicafe {restaurant.name}</h1>
		{restaurant.lunchHours && (
			<p className="text-xl">Lunch {restaurant.lunchHours}</p>
		)}
		<div className="scrollbar-none overflow-y-auto rounded-t-2xl pb-4">
			<div className="flex w-full flex-col items-center gap-y-3">
				<Menu foodlist={restaurant.menuGroups} />
			</div>
		</div>
	</div>
);

const Menu = ({ foodlist }: { foodlist: RestaurantData['menuGroups'] }) => {
	const categories = Object.keys(foodlist);

	return categories.map((category) => {
		const categoryFoods = foodlist[category];

		if (!categoryFoods || categoryFoods.length === 0) return null;

		return (
			<div key={category} className="flex w-full flex-col gap-y-2">
				<h2 className="-mb-2 ml-3 text-lg">
					{category.toUpperCase().replace('KAIVOPIHA', '').trim()}
				</h2>
				{categoryFoods.map((food) => (
					<Food
						key={food.name}
						food={food}
						displayMeta={category !== 'tiedoitus'}
					/>
				))}
			</div>
		);
	});
};
