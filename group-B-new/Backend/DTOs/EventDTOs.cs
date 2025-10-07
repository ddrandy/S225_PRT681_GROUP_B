using System.ComponentModel.DataAnnotations;

namespace NTEventFinder.DTOs;

public class CreateEventRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(50)]
    public string Time { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    public string? ImagePath { get; set; }
}

public class UpdateEventRequest
{
    [MaxLength(200)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateTime? Date { get; set; }

    [MaxLength(50)]
    public string? Time { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }

    public string? ImagePath { get; set; }

    public bool? IsApproved { get; set; }
}

public class EventResponse
{
    public int EventId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Time { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? ImagePath { get; set; }
    public int CreatedBy { get; set; }
    public string CreatorUsername { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsFavorited { get; set; } = false;
}
