import React from 'react';

interface MenuCardProps {
  title: string;
  description: string;
  color: string;
  imageUrl?: string;
}

export const MenuCard: React.FC<MenuCardProps> = ({ 
  title, 
  description, 
  color,
  imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop'
}) => {
  return (
    <div className="bg-white dark:bg-[#171A2A] border border-gray-200 dark:border-gray-800 rounded-[12px] overflow-hidden hover:scale-105 transition-transform cursor-pointer h-[220px] flex flex-col shadow-sm dark:shadow-none">
      {/* Bagian Preview Foto */}
      <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#171A2A] to-transparent opacity-60" />
      </div>
      
      {/* Bagian Konten */}
      <div className="p-4 flex-1 flex flex-col min-h-28">
        <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{description}</p>
      </div>
      
      {/* Color Accent Bar */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

// Demo Component
export default function Demo() {
  const menuItems = [
    {
      title: "Nasi Goreng Special",
      description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
      color: "#FF6B6B",
      imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=250&fit=crop"
    },
    {
      title: "Sate Ayam",
      description: "Sate ayam bakar dengan bumbu kacang khas",
      color: "#4ECDC4",
      imageUrl: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=250&fit=crop"
    },
    {
      title: "Gado-Gado",
      description: "Salad sayuran dengan saus kacang yang lezat",
      color: "#95E1D3",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F1119] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Menu Kami</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <MenuCard
              key={index}
              title={item.title}
              description={item.description}
              color={item.color}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}