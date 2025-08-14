//for UI display of total time only

export function calculateDisplayHours(
	timeIn: string | Date,
	timeOut: string | Date | null,
): { displayHours: number } {
	const BREAK_HOURS = 1;

	if (!timeOut) {
		return { displayHours: 0 };
	}

	const startTime = new Date(timeIn);
	const endTime = new Date(timeOut);

	if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
		return { displayHours: 0 };
	}

	const grossDurationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
	const netWorkHours = Math.max(0, grossDurationHours - BREAK_HOURS);
	const displayHours = Math.floor(netWorkHours * 100) / 100;

	return {
		displayHours,
	};
}