'use client';

import { useRef } from 'react';

export default function GalleryUploader({ files, setFiles, maxFiles = 12, maxSizeMb = 5 }) {
	const inputRef = useRef(null);

	const handleSelect = (e) => {
		const selected = Array.from(e.target.files || []);
		const valid = [];
		for (const file of selected) {
			if (!file.type.startsWith('image/')) continue;
			if (file.size > maxSizeMb * 1024 * 1024) continue;
			valid.push(file);
		}
		if (valid.length === 0) return;
		setFiles((prev) => {
			const merged = [...(prev || []), ...valid].slice(0, maxFiles);
			return merged;
		});
		if (inputRef.current) inputRef.current.value = '';
	};

	const removeAt = (idx) => {
		setFiles((prev) => prev.filter((_, i) => i !== idx));
	};

	return (
		<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-semibold text-gray-900">Galeri Foto</h3>
				<span className="text-xs text-gray-500">Maks {maxFiles} foto, ≤ {maxSizeMb}MB/foto</span>
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={handleSelect}
				className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
			/>
			{Array.isArray(files) && files.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
					{files.map((file, idx) => {
						const url = typeof file === 'string' ? file : URL.createObjectURL(file);
						return (
							<div key={idx} className="relative group">
								<img src={url} alt={`gallery-${idx}`} className="w-full h-28 object-cover rounded border" />
								<button
									type="button"
									onClick={() => removeAt(idx)}
									className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center text-sm"
									title="Hapus"
								>
									×
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}


