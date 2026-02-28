import Link from 'next/link';

type CategoryItem = {
  id:    string;
  name:  string;
  desc:  string;
  href:  string;
  color: string;
  path:  string;
};

const CATEGORIES: CategoryItem[] = [
  {
    id:    'SMARTPHONES',
    name:  'Smartphones & Tablets',
    desc:  'Latest devices',
    href:  '/products?category=SMARTPHONES',
    color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    path:  'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    id:    'LAPTOPS',
    name:  'Laptops & Computers',
    desc:  'Work & play',
    href:  '/products?category=LAPTOPS',
    color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100',
    path:  'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    id:    'HOME_APPLIANCES',
    name:  'Home Appliances',
    desc:  'Smart & efficient',
    href:  '/products?category=HOME_APPLIANCES',
    color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
    path:  'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    id:    'KITCHEN',
    name:  'Kitchen Appliances',
    desc:  'Cook with ease',
    href:  '/products?category=KITCHEN',
    color: 'bg-orange-50 text-orange-500 group-hover:bg-orange-100',
    path:  'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
  {
    id:    'BEDROOM',
    name:  'Bedroom & Living',
    desc:  'Comfort & style',
    href:  '/products?category=BEDROOM',
    color: 'bg-pink-50 text-pink-500 group-hover:bg-pink-100',
    path:  'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    id:    'AUDIO_TV',
    name:  'Audio & Television',
    desc:  'Entertainment',
    href:  '/products?category=AUDIO_TV',
    color: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100',
    path:  'M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
  {
    id:    'ELECTRICAL',
    name:  'Electrical & Lighting',
    desc:  'Power your space',
    href:  '/products?category=ELECTRICAL',
    color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
    path:  'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    id:    'SMART_HOME',
    name:  'Smart Home',
    desc:  'Automate life',
    href:  '/products?category=SMART_HOME',
    color: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100',
    path:  'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  },
];

export function Categories() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CATEGORIES.map((cat, i) => (
        <Link
          key={cat.id}
          href={cat.href}
          className="group relative p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl ${cat.color} flex items-center justify-center mb-4 transition-colors duration-300`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.path} />
            </svg>
          </div>

          <div className="font-semibold text-gray-900 text-sm leading-snug">{cat.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{cat.desc}</div>

          {/* Arrow */}
          <svg
            className="absolute top-5 right-5 w-3.5 h-3.5 text-gray-300 transition-all duration-300 group-hover:text-gray-500 group-hover:translate-x-0.5"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
