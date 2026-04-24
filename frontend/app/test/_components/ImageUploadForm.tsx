'use client'

import { useState } from 'react'
import { uuid } from 'zod'

export default function ImageUploadForm({
	getUploadUrl,
}: {
	getUploadUrl: (fileName: string, fileType: string) => Promise<string>
}) {
	const [file, setFile] = useState<File | null>(null)

	const handleUpload = async () => {
		if (!file) return

		console.log('file', file)

		const fileName = `${Date.now()}-${file.name}`

		// Step 1: Get signed URL from server action
		const url = await getUploadUrl(fileName, file.type)
		console.log('url', url)
		console.log('fileType:', file.type)
		console.log('file:', fileName)

		// Step 2: Upload file directly to S3
		const result = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type,
			},
			body: file,
		})

		console.log(result)

		// alert('Upload successful!')
	}

	return (
		<div>
			<input
				className="border p-2"
				type="file"
				onChange={(e) => setFile(e.target.files?.[0] || null)}
			/>
			<button className="bg-slate-500" onClick={handleUpload}>
				Upload
			</button>
		</div>
	)
}
