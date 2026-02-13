import type { MenuItem as MenuItemType } from '@/lib/schemas';

interface MenuItemProps {
  item: MenuItemType;
}

const dietaryIcons = {
  v: { label: 'Vegetarian', icon: '🌱' },
  vg: { label: 'Vegan', icon: '🌿' },
  gf: { label: 'Gluten-Free', icon: '🌾' },
  df: { label: 'Dairy-Free', icon: '🥛' },
  n: { label: 'Contains Nuts', icon: '🥜' },
};

export default function MenuItem({ item }: MenuItemProps) {
  return (
    <div className="flex justify-between items-start gap-4 print-break-inside-avoid">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900">
            {item.name}
            {item.spicy && (
              <span className="ml-2 text-red-500" title="Spicy">
                🌶️
              </span>
            )}
          </h3>
          {item.dietary && item.dietary.length > 0 && (
            <div className="flex gap-1">
              {item.dietary.map((diet) => (
                <span
                  key={diet}
                  className="text-xs"
                  title={dietaryIcons[diet].label}
                >
                  {dietaryIcons[diet].icon}
                </span>
              ))}
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        )}
        {item.addOns && item.addOns.length > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            <span className="font-medium">Add-ons: </span>
            {item.addOns.map((addOn, idx) => (
              <span key={idx}>
                {addOn.name} (+{addOn.price})
                {idx < item.addOns!.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
      {item.price && (
        <div className="font-semibold text-gray-900 whitespace-nowrap">
          {item.price}
        </div>
      )}
    </div>
  );
}
