using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));

            builder.Entity<UserActivity>().HasOne(x=>x.AppUser).WithMany(x=>x.UserActivities).HasForeignKey(x=>x.AppUserId);

            builder.Entity<UserActivity>().HasOne(x=>x.Activity).WithMany(x=>x.UserActivities).HasForeignKey(x=>x.ActivityId);

        }
    }
}
