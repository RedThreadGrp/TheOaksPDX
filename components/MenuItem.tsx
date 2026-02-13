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
    <div className="flex justify-between items-start gap-6 print-break-inside-avoid py-4 border-b border-gray-200 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-oak-brown">
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
                  className="text-sm"
                  title={dietaryIcons[diet].label}
                >
                  {dietaryIcons[diet].icon}
                </span>
              ))}
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-base text-gray-600 leading-relaxed mb-2">{item.description}</p>
        )}
        {item.addOns && item.addOns.length > 0 && (
          <div className="text-sm text-gray-500 mt-3 pl-4 border-l-2 border-gold/30">
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
        <div className="text-xl font-bold text-gold whitespace-nowrap">
          {item.price}
        </div>
      )}
    </div>
  );
}
