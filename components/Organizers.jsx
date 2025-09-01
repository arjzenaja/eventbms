"use client";
import Image from "next/image";
import Link from "next/link";
import { BiUser, BiEnvelope, BiPhone, BiGlobe } from "react-icons/bi";

const Organizers = ({ event }) => {
  // Handle both old organizer field and new organizers array
  let organizers = [];
  
  if (Array.isArray(event?.organizers) && event.organizers.length > 0) {
    organizers = event.organizers;
  } else if (event?.organizer) {
    organizers = [{ name: event.organizer, role: 'Penyelenggara Utama' }];
  }

  if (organizers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Penyelenggara Event</h3>
        <p className="text-gray-600 dark:text-gray-400">Tim yang bertanggung jawab atas event ini</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {organizers.map((organizer, index) => (
          <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/30 dark:border-purple-700/30">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                {organizer.img_avatar ? (
                  <Image 
                    src={organizer.img_avatar} 
                    width={64} 
                    height={64} 
                    alt={organizer.name || "Organizer avatar"}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <BiUser className="text-white text-2xl" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {organizer.name || 'Penyelenggara'}
                </h4>
                <p className="text-purple-600 dark:text-purple-400 font-medium text-sm mb-3">
                  {organizer.role || organizer.job || 'Penyelenggara Event'}
                </p>
                
                {/* Contact Information */}
                {(organizer.email || organizer.phone || organizer.website) && (
                  <div className="space-y-2">
                    {organizer.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <BiEnvelope className="w-4 h-4" />
                        <a href={`mailto:${organizer.email}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {organizer.email}
                        </a>
                      </div>
                    )}
                    
                    {organizer.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <BiPhone className="w-4 h-4" />
                        <a href={`tel:${organizer.phone}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {organizer.phone}
                        </a>
                      </div>
                    )}
                    
                    {organizer.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <BiGlobe className="w-4 h-4" />
                        <a href={organizer.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {organizer.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Social Media Links */}
                {Array.isArray(organizer.social) && organizer.social.length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {organizer.social.map((social, socialIndex) => (
                      <Link 
                        href={social.path || "#"} 
                        key={socialIndex}
                        className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.icon ? (
                          <Image 
                            src={social.icon}
                            width={16}
                            height={16}
                            alt={`${social.name || 'Social media'} icon`}
                            className="w-4 h-4"
                          />
                        ) : (
                          <span className="text-white text-xs font-bold">
                            {social.name?.charAt(0) || 'S'}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Organizers;